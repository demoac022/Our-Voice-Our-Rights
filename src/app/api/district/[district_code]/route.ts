import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { DistrictPerformance } from '@/models/DistrictPerformance';
import { mgnregaService } from '@/services/mgnrega';
import { DISTRICTS } from '@/data/districts';

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
  context: { params: Promise<{ district_code: string }> }
) {
  try {
    const params = await context.params;
    const districtId = params.district_code;
    const districtInfo = DISTRICTS.find(d => d.id === districtId);

    if (!districtInfo) {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    // Fetch real performance data from MGNREGA API
    const performanceData = await mgnregaService.getDistrictPerformance(districtId);
    
    return NextResponse.json({
      district_code: districtId,
      district_name: districtInfo.name,
      state_name: districtInfo.state,
      performance_data: {
        total_workers: parseInt(performanceData.Total_No_of_Workers),
        active_workers: parseInt(performanceData.Total_No_of_Active_Workers),
        wages_paid: parseFloat(performanceData.Wages),
        work_days_generated: parseInt(performanceData.Total_Households_Worked),
        avg_days_employment: parseFloat(performanceData.Average_days_of_employment_provided_per_Household),
        avg_wage_rate: parseFloat(performanceData.Average_Wage_rate_per_day_per_person),
        completed_100_days: parseInt(performanceData.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
        total_expenditure: parseFloat(performanceData.Total_Exp),
        women_participation: parseInt(performanceData.Women_Persondays),
        sc_participation: parseInt(performanceData.SC_persondays),
        st_participation: parseInt(performanceData.ST_persondays),
        payment_within_15_days: parseFloat(performanceData.percentage_payments_gererated_within_15_days)
      }
    });

    return NextResponse.json({ error: 'Failed to fetch district data' }, { status: 500 });
  } catch (error) {
    console.error('Error fetching district data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch district data' },
      { status: 500 }
    );
  }
}