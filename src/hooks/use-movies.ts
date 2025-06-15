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
    queryFn: (): Promise<MovieResponse> => movieService.getNewMovies(page),
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
    queryFn: (): Promise<MovieResponse> => movieService.getNewMoviesV2(page),
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
    queryFn: (): Promise<MovieDetailResponse> => movieService.getMovieDetail(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook để tìm kiếm phim
 */
export const useSearchMovies = (
  params: SearchParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "search", params],
    queryFn: (): Promise<MovieResponse> => movieService.searchMovies(params),
    enabled: !!params.keyword && params.keyword.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy phim theo thể loại
 */
export const useMoviesByCategory = (
  slug: string,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "category", slug, params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByCategory(slug, params),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy phim theo quốc gia
 */
export const useMoviesByCountry = (
  slug: string,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "country", slug, params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByCountry(slug, params),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy phim theo năm
 */
export const useMoviesByYear = (
  year: number,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "year", year, params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByYear(year, params),
    enabled: !!year,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để lấy phim theo loại (type)
 */
export const useMoviesByType = (
  type: MovieType,
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "type", type, params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByType(type, params),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy phim bộ
 */
export const useSeriesMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "series", params],
    queryFn: async (): Promise<MovieResponse> => {
      const result = await movieService.getMoviesByType("phim-bo", params);
      return result as MovieResponse;
    },
    staleTime: 0,
    gcTime: 0,
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
    queryFn: async (): Promise<MovieResponse> => {
      const result = await movieService.getMoviesByType("phim-le", params);
      return result as MovieResponse;
    },
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};

/**
 * Hook để lấy phim hoạt hình
 */
export const useAnimationMovies = (
  params?: MovieListParams
): UseQueryResult<MovieResponse> => {
  return useQuery({
    queryKey: ["movies", "hoat-hinh", params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByType("hoat-hinh", params),
    staleTime: 0,
    gcTime: 0,
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
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByType("phim-vietsub", params),
    staleTime: 0,
    gcTime: 0,
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
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByType("phim-thuyet-minh", params),
    staleTime: 0,
    gcTime: 0,
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
    queryKey: ["movies", "long-tieng", params],
    queryFn: (): Promise<MovieResponse> => movieService.getMoviesByType("phim-long-tieng", params),
    staleTime: 0,
    gcTime: 0,
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
    queryFn: async (): Promise<MovieResponse> => {
      const result = await movieService.getMoviesByType("tv-shows", params);
      return result as MovieResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
    retry: 1,
  });
};
