import mongoose from 'mongoose';

const districtPerformanceSchema = new mongoose.Schema({
  district_code: {
    type: String,
    required: true,
    index: true,
  },
  district_name: {
    type: String,
    required: true,
  },
  state_name: {
    type: String,
    required: true,
  },
  performance_data: {
    total_workers: Number,
    active_workers: Number,
    wages_paid: Number,
    work_days_generated: Number,
    // Add more fields as needed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400, // Documents will be automatically deleted after 24 hours
  },
});

// This type represents the document structure
export interface DistrictPerformance {
  district_code: string;
  district_name: string;
  state_name: string;
  performance_data: {
    total_workers: number;
    active_workers: number;
    wages_paid: number;
    work_days_generated: number;
  };
  timestamp: Date;
}

// Export the model if it hasn't been compiled yet
export const DistrictPerformance = mongoose.models.DistrictPerformance || 
  mongoose.model<DistrictPerformance>('DistrictPerformance', districtPerformanceSchema);