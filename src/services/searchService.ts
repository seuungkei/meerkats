import { searchRepository } from '../repositories/searchRepository';
import { SearchDTO } from '../dto/search.dto';

class searchService {
  constructor(private Repository: searchRepository) {}

  public async movieSearch(movieTitle: string): Promise<SearchDTO[]> {
    return this.Repository.movieSearch(movieTitle);
  }
}

export { searchService };
