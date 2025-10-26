interface MGNREGAResponse {
  // Define the API response structure here based on data.gov.in API
  // This is a placeholder and should be updated with actual API schema
  district_code: string;
  district_name: string;
  state_name: string;
  total_workers: number;
  active_workers: number;
  wages_paid: number;
  work_days_generated: number;
  // Add more fields as per the actual API response
}

class MGNREGAService {
  private baseUrl = 'https://api.data.gov.in/resource/';
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 1000 * 60 * 60; // 1 hour

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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
      const response = await fetch(
        `${this.baseUrl}${endpoint}?api-key=${this.apiKey}&${new URLSearchParams(
          params
        ).toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getDistrictPerformance(districtCode: string): Promise<MGNREGAResponse> {
    return this.fetchWithCache<MGNREGAResponse>('mgnrega-performance', {
      district_code: districtCode,
    });
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