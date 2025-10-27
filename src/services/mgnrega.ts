interface MGNREGARecord {
  fin_year: string;
  month: string;
  state_code: string;
  state_name: string;
  district_code: string;
  district_name: string;
  Approved_Labour_Budget: string;
  Average_Wage_rate_per_day_per_person: string;
  Average_days_of_employment_provided_per_Household: string;
  Differently_abled_persons_worked: string;
  Total_Households_Worked: string;
  Total_Individuals_Worked: string;
  Total_No_of_Active_Job_Cards: string;
  Total_No_of_Active_Workers: string;
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: string;
  Total_No_of_JobCards_issued: string;
  Total_No_of_Workers: string;
  Total_Exp: string;
  Wages: string;
  Women_Persondays: string;
  SC_persondays: string;
  ST_persondays: string;
  percentage_payments_gererated_within_15_days: string;
}

interface MGNREGAResponse {
  status: string;
  total: number;
  count: number;
  limit: string;
  offset: string;
  records: MGNREGARecord[];
}

class MGNREGAService {
  // Resource ID for MGNREGA data from data.gov.in
  private resourceId = 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722'; // District-wise MGNREGA Data at a Glance
  private baseUrl = 'https://api.data.gov.in/resource/';
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 1000 * 60 * 60; // 1 hour

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error('MGNREGA API key is required');
    }
  }

  private parseNumeric(value: string): number {
    return parseFloat(value) || 0;
  }

  private getCacheKey(endpoint: string, params: Record<string, string>): string {
    return `${endpoint}?${new URLSearchParams(params).toString()}`;
  }

  private isValidCache(cacheEntry: { timestamp: number }): boolean {
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  private async fetchWithCache<T>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && this.isValidCache(cachedData)) {
      return cachedData.data as T;
    }

    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      url.searchParams.set('api-key', this.apiKey);
      url.searchParams.set('format', 'json');
      
      // Add all other params
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`API error: ${data.message || 'Unknown error'}`);
      }

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getDistrictPerformance(districtCode: string): Promise<MGNREGARecord> {
    // Get the current financial year
    const today = new Date();
    const fiscalYear = today.getMonth() >= 3 ? // April onwards
      `${today.getFullYear()}-${today.getFullYear() + 1}` :
      `${today.getFullYear() - 1}-${today.getFullYear()}`;

    const response = await this.fetchWithCache<MGNREGAResponse>(this.resourceId, {
      filters: `[{"column":"district_code","operator":"=","value":"${districtCode}"},{"column":"fin_year","operator":"=","value":"${fiscalYear}"}]`,
      limit: '1'
    });

    if (!response.records || response.records.length === 0) {
      throw new Error(`No data found for district code: ${districtCode}`);
    }

    return response.records[0];
  }

  async getStateDistricts(stateCode: string): Promise<string[]> {
    return this.fetchWithCache<string[]>('mgnrega-districts', {
      state_code: stateCode,
    });
  }

  async getDistrictByLocation(lat: number, lon: number): Promise<string> {
    return this.fetchWithCache<string>('reverse-geocode', {
      latitude: lat.toString(),
      longitude: lon.toString(),
    });
  }
}

export const mgnregaService = new MGNREGAService(
  process.env.NEXT_PUBLIC_DATA_GOV_API_KEY || ''
);