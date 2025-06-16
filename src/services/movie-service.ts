import type {
  MovieResponse,
  MovieDetailResponse,
  MovieListParams,
  SearchParams,
  MovieType,
  CategoriesResponse,
} from "@/types";
import { phimApi } from "@/lib/axios";

class MovieService {
  /**
   * Private method to handle API calls
   */
  private async fetchFromAPI<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const response = await phimApi.get<T>(endpoint, { params });
    return response.data;
  }

  /**
   * Lấy danh sách phim mới cập nhật
   */
  async getNewMovies(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>("/danh-sach/phim-moi-cap-nhat", {
      page,
    });
  }

  /**
   * Lấy danh sách phim mới cập nhật V2
   */
  async getNewMoviesV2(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>("/danh-sach/phim-moi-cap-nhat-v2", {
      page,
    });
  }

  /**
   * Lấy danh sách phim mới cập nhật V3
   */
  async getNewMoviesV3(page: number = 1): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>("/danh-sach/phim-moi-cap-nhat-v3", {
      page,
    });
  }

  /**
   * Lấy chi tiết phim và danh sách tập phim
   */
  async getMovieDetail(slug: string): Promise<MovieDetailResponse> {
    return this.fetchFromAPI<MovieDetailResponse>(`/phim/${slug}`);
  }

  /**
   * Lấy danh sách phim theo loại
   */
  async getMoviesByType(
    type: MovieType,
    params?: MovieListParams
  ): Promise<MovieResponse> {
    const url = `/v1/api/danh-sach/${type}`;

    try {
      const result = await this.fetchFromAPI<MovieResponse>(url, params);
      return result;
    } catch (error) {
      console.error(`🎬 Movie Service: Error for ${type}:`, error);
      throw error;
    }
  }

  /**
   * Tìm kiếm phim
   */
  async searchMovies(searchParams: SearchParams): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>("/v1/api/tim-kiem", searchParams);
  }

  /**
   * Lấy danh sách thể loại
   */
  async getCategories(): Promise<CategoriesResponse> {
    return this.fetchFromAPI<CategoriesResponse>("/the-loai");
  }

  /**
   * Lấy phim theo thể loại
   */
  async getMoviesByCategory(
    categorySlug: string,
    params?: MovieListParams
  ): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(
      `/v1/api/the-loai/${categorySlug}`,
      params
    );
  }

  /**
   * Lấy danh sách quốc gia
   */
  async getCountries(): Promise<any> {
    return this.fetchFromAPI<any>("/quoc-gia");
  }

  /**
   * Lấy phim theo quốc gia
   */
  async getMoviesByCountry(
    countrySlug: string,
    params?: MovieListParams
  ): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(
      `/v1/api/quoc-gia/${countrySlug}`,
      params
    );
  }

  /**
   * Lấy phim theo năm
   */
  async getMoviesByYear(
    year: number,
    params?: Omit<MovieListParams, "year">
  ): Promise<MovieResponse> {
    return this.fetchFromAPI<MovieResponse>(`/v1/api/nam/${year}`, params);
  }

  // Convenience methods for specific movie types

  /**
   * Lấy phim bộ
   */
  async getSeriesMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("phim-bo", params);
  }

  /**
   * Lấy phim lẻ
   */
  async getSingleMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("phim-le", params);
  }

  /**
   * Lấy TV shows
   */
  async getTVShows(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("tv-shows", params);
  }

  /**
   * Lấy hoạt hình
   */
  async getAnimationMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("hoat-hinh", params);
  }

  /**
   * Lấy phim vietsub
   */
  async getVietsubMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("phim-vietsub", params);
  }

  /**
   * Lấy phim thuyết minh
   */
  async getDubbedMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("phim-thuyet-minh", params);
  }

  /**
   * Lấy phim lồng tiếng
   */
  async getVoiceoverMovies(params?: MovieListParams): Promise<MovieResponse> {
    return this.getMoviesByType("phim-long-tieng", params);
  }
}

export const movieService = new MovieService();
