import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { movieService } from "@/services";
import type {
  MovieResponse,
  MovieDetailResponse,
  MovieListParams,
  SearchParams,
  MovieType,
} from "@/types";

/**
 * Hook để lấy danh sách phim mới cập nhật
 */
export const useNewMovies = (
  page: number = 1
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "new", page],
    queryFn: () => movieService.getNewMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy danh sách phim mới cập nhật V2
 */
export const useNewMoviesV2 = (
  page: number = 1
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "new-v2", page],
    queryFn: () => movieService.getNewMoviesV2(page),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy chi tiết phim
 */
export const useMovieDetail = (
  slug: string
): UseQueryResult<MovieDetailResponse> => {
  return useQuery({
    queryKey: ["movie", "detail", slug],
    queryFn: () => movieService.getMovieDetail(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook để lấy phim theo loại
 */
export const useMoviesByType = (
  type: MovieType,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "type", type, params],
    queryFn: () => movieService.getMoviesByType(type, params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để tìm kiếm phim
 */
export const useSearchMovies = (
  searchParams: SearchParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "search", searchParams],
    queryFn: () => movieService.searchMovies(searchParams),
    enabled: !!searchParams.keyword?.trim(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy danh sách thể loại
 */
export const useCategories = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => movieService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook để lấy phim theo thể loại
 */
export const useMoviesByCategory = (
  categorySlug: string,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "category", categorySlug, params],
    queryFn: () => movieService.getMoviesByCategory(categorySlug, params),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy danh sách quốc gia
 */
export const useCountries = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => movieService.getCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook để lấy phim theo quốc gia
 */
export const useMoviesByCountry = (
  countrySlug: string,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "country", countrySlug, params],
    queryFn: () => movieService.getMoviesByCountry(countrySlug, params),
    enabled: !!countrySlug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy phim theo năm
 */
export const useMoviesByYear = (
  year: number,
  params?: Omit<MovieListParams, "year">
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "year", year, params],
    queryFn: () => movieService.getMoviesByYear(year, params),
    enabled: !!year,
    staleTime: 5 * 60 * 1000,
  });
};

// Convenience hooks for specific movie types

/**
 * Hook để lấy phim bộ
 */
export const useSeriesMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "series", params],
    queryFn: async () => {
      try {
        const result = await movieService.getMoviesByType("phim-bo", params);
        return result;
      } catch (error) {
        console.error("🔥 Error calling phim-bo API:", error);
        throw error;
      }
    },
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy phim lẻ
 */
export const useSingleMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "single", params],
    queryFn: async () => {
      try {
        const result = await movieService.getMoviesByType("phim-le", params);
        return result;
      } catch (error) {
        console.error("🔥 Error calling phim-le API:", error);
        throw error;
      }
    },
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy hoạt hình
 */
export const useAnimationMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "hoat-hinh", params],
    queryFn: () => movieService.getMoviesByType("hoat-hinh", params),
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy phim vietsub
 */
export const useVietsubMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "vietsub", params],
    queryFn: () => movieService.getMoviesByType("phim-vietsub", params),
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy phim thuyết minh
 */
export const useThuyetMinhMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "thuyet-minh", params],
    queryFn: () => movieService.getMoviesByType("phim-thuyet-minh", params),
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy TV Shows
 */
export const useTVShows = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "tv-shows", params],
    queryFn: async () => {
      const result = await movieService.getMoviesByType("tv-shows", params);
      return result;
    },
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy phim lồng tiếng
 */
export const useLongTiengMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "phim-long-tieng", params],
    queryFn: async () => {
      const result = await movieService.getMoviesByType(
        "phim-long-tieng",
        params
      );
      return result;
    },
    staleTime: 0,
    cacheTime: 0,
    retry: 1,
  });
};
