import * as tf from '@tensorflow/tfjs';
import { Logs } from '@tensorflow/tfjs-layers';

export type TrafficStatus = 'optimal' | 'congested' | 'critical';

interface TrafficData {
  vehicles: number;
  avgSpeed: number;
  timeOfDay: number;
  dayOfWeek: number;
}

interface ModelConfig {
  sequenceLength: number;
  features: number;
  learningRate: number;
  lstmUnits: number[];
  dropoutRate: number;
}

export class TrafficPredictionService {
  private static model: tf.LayersModel | null = null;
  private static readonly modelConfig: ModelConfig = {
    sequenceLength: 24,  // 24 hours of historical data
    features: 4,         // vehicles, avgSpeed, timeOfDay, dayOfWeek
    learningRate: 0.001,
    lstmUnits: [64, 32],
    dropoutRate: 0.2
  };

  static async initializeModel() {
    try {
      // Create a more sophisticated LSTM model for traffic prediction
      const model = tf.sequential();
      
      // First LSTM layer with dropout
      model.add(tf.layers.lstm({
        units: this.modelConfig.lstmUnits[0],
        returnSequences: true,
        inputShape: [this.modelConfig.sequenceLength, this.modelConfig.features],
        recurrentDropout: this.modelConfig.dropoutRate
      }));
      
      // Add dropout layer
      model.add(tf.layers.dropout({ rate: this.modelConfig.dropoutRate }));
      
      // Second LSTM layer
      model.add(tf.layers.lstm({
        units: this.modelConfig.lstmUnits[1],
        returnSequences: false,
        recurrentDropout: this.modelConfig.dropoutRate
      }));
      
      // Add dropout layer
      model.add(tf.layers.dropout({ rate: this.modelConfig.dropoutRate }));
      
      // Dense layer with softmax activation for classification
      model.add(tf.layers.dense({
        units: 3,
        activation: 'softmax'
      }));

      // Compile model with Adam optimizer and learning rate scheduler
      const optimizer = tf.train.adam(this.modelConfig.learningRate);
      model.compile({
        optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      this.model = model;
      console.log('Traffic prediction model initialized successfully');
    } catch (error) {
      console.error('Error initializing traffic prediction model:', error);
      throw error;
    }
  }

  static async predictTrafficStatus(
    historicalData: TrafficData[]
  ): Promise<TrafficStatus> {
    try {
      if (!this.model) {
        await this.initializeModel();
      }

      // Validate input data
      if (historicalData.length < this.modelConfig.sequenceLength) {
        throw new Error(`Insufficient historical data. Need at least ${this.modelConfig.sequenceLength} data points.`);
      }

      // Get the most recent sequence of data
      const recentData = historicalData.slice(-this.modelConfig.sequenceLength);

      // Prepare and normalize input data
      const normalizedData = recentData.map(data => [
        data.vehicles / 100,    // Normalize vehicle count
        data.avgSpeed / 60,     // Normalize speed (km/h)
        Math.sin(2 * Math.PI * data.timeOfDay / 24),  // Cyclical time encoding
        Math.cos(2 * Math.PI * data.timeOfDay / 24),  // Cyclical time encoding
        Math.sin(2 * Math.PI * data.dayOfWeek / 7),   // Cyclical day encoding
        Math.cos(2 * Math.PI * data.dayOfWeek / 7)    // Cyclical day encoding
      ]);

      // Create input tensor
      const inputData = tf.tensor3d([normalizedData]);

      // Make prediction with memory cleanup
      const prediction = await tf.tidy(() => {
        const pred = this.model!.predict(inputData) as tf.Tensor;
        return Array.from(pred.dataSync());
      });

      // Cleanup tensors
      inputData.dispose();

      // Get prediction probabilities
      const [optimal, congested, critical] = prediction;
      
      // Return predicted status with confidence threshold
      const CONFIDENCE_THRESHOLD = 0.4;
      
      if (optimal > CONFIDENCE_THRESHOLD && optimal > congested && optimal > critical) {
        return 'optimal';
      } else if (congested > CONFIDENCE_THRESHOLD && congested > critical) {
        return 'congested';
      } else if (critical > CONFIDENCE_THRESHOLD) {
        return 'critical';
      } else {
        // Default to congested if no clear prediction
        return 'congested';
      }
    } catch (error) {
      console.error('Error predicting traffic status:', error);
      throw error;
    }
  }

  static async updateModel(
    trainingData: Array<{
      features: TrafficData[];
      label: TrafficStatus;
    }>
  ): Promise<tf.History> {
    try {
      if (!this.model) {
        await this.initializeModel();
      }

      // Validate training data
      if (trainingData.length === 0) {
        throw new Error('No training data provided');
      }

      // Prepare input data
      const inputs = trainingData.map(data => {
        if (data.features.length !== this.modelConfig.sequenceLength) {
          throw new Error(`Each training sequence must have exactly ${this.modelConfig.sequenceLength} data points`);
        }
        
        return data.features.map(feature => [
          feature.vehicles / 100,
          feature.avgSpeed / 60,
          Math.sin(2 * Math.PI * feature.timeOfDay / 24),
          Math.cos(2 * Math.PI * feature.timeOfDay / 24),
          Math.sin(2 * Math.PI * feature.dayOfWeek / 7),
          Math.cos(2 * Math.PI * feature.dayOfWeek / 7)
        ]);
      });

      // Prepare output data (one-hot encoding)
      const outputs = trainingData.map(data => {
        switch (data.label) {
          case 'optimal': return [1, 0, 0];
          case 'congested': return [0, 1, 0];
          case 'critical': return [0, 0, 1];
        }
      });

      // Convert to tensors with memory management
      const inputTensor = tf.tensor3d(inputs);
      const outputTensor = tf.tensor2d(outputs);

      try {
        // Train model with early stopping and learning rate scheduling
        const history = await this.model!.fit(inputTensor, outputTensor, {
          epochs: 50,
          batchSize: 32,
          validationSplit: 0.2,
          shuffle: true,
          callbacks: [
            tf.callbacks.earlyStopping({
              monitor: 'val_loss',
              patience: 5,
              minDelta: 0.01
            }),
            {
              onEpochEnd: (epoch: number, logs?: Logs) => {
                console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
              }
            }
          ]
        });

        console.log('Model training completed successfully');
        return history;
      } finally {
        // Cleanup tensors
        inputTensor.dispose();
        outputTensor.dispose();
      }
    } catch (error) {
      console.error('Error updating traffic prediction model:', error);
      throw error;
    }
  }

  // Save model weights to localStorage
  static async saveModel(): Promise<void> {
    try {
      if (!this.model) {
        throw new Error('No model to save');
      }
      await this.model.save('localstorage://traffic-prediction-model');
      console.log('Model saved successfully');
    } catch (error) {
      console.error('Error saving model:', error);
      throw error;
    }
  }

  // Load model weights from localStorage
  static async loadModel(): Promise<void> {
    try {
      const model = await tf.loadLayersModel('localstorage://traffic-prediction-model');
      this.model = model;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }
}
