import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { DistrictPerformance } from '@/models/DistrictPerformance';
import { mgnregaService } from '@/services/mgnrega';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export async function GET(
  request: Request,
  context: { params: { district_code: string } }
) {
  try {
    await connectDB();

    // District-specific mock data
    const getDistrictData = (districtId: string) => {
      // Base multiplier from district ID to create varying data
      const multiplier = parseInt(districtId) || 1;
      
      return {
        district_code: districtId,
        district_name: districtId === "1" ? "Bangalore Rural" :
                      districtId === "2" ? "Mysore" :
                      districtId === "3" ? "Varanasi" :
                      districtId === "4" ? "Patna" :
                      districtId === "5" ? "Jaipur" :
                      districtId === "6" ? "Pune" :
                      districtId === "7" ? "Ahmedabad" :
                      districtId === "8" ? "Chennai" :
                      districtId === "9" ? "Hyderabad" :
                      districtId === "10" ? "Bhopal" : "Unknown District",
        state_name: districtId === "1" || districtId === "2" ? "Karnataka" :
                   districtId === "3" ? "Uttar Pradesh" :
                   districtId === "4" ? "Bihar" :
                   districtId === "5" ? "Rajasthan" :
                   districtId === "6" ? "Maharashtra" :
                   districtId === "7" ? "Gujarat" :
                   districtId === "8" ? "Tamil Nadu" :
                   districtId === "9" ? "Telangana" :
                   districtId === "10" ? "Madhya Pradesh" : "Unknown State",
        performance_data: {
          total_workers: 100000 + (multiplier * 25000),
          active_workers: 50000 + (multiplier * 12500),
          wages_paid: 2000000 + (multiplier * 500000),
          work_days_generated: 75000 + (multiplier * 15000)
        }
      };
    };

    const mockData = getDistrictData(context.params.district_code);

    return NextResponse.json(mockData);

    // Comment out the database operations for now
    /*
    let districtData = await DistrictPerformance.findOne({
      district_code: params.district_code,
      timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (!districtData) {
      const apiData = await mgnregaService.getDistrictPerformance(params.district_code);
      
      districtData = await DistrictPerformance.create({
        district_code: params.district_code,
        district_name: apiData.district_name,
        state_name: apiData.state_name,
        performance_data: {
          total_workers: apiData.total_workers,
          active_workers: apiData.active_workers,
          wages_paid: apiData.wages_paid,
          work_days_generated: apiData.work_days_generated,
        },
      });
    }
    */
    // return NextResponse.json(districtData);

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching district data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch district data' },
      { status: 500 }
    );
  }
}