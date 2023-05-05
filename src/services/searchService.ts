import { searchRepository } from "../repositories/searchRepository";

class searchService {
  constructor(private Repository: searchRepository) {
  }

  public async blogSearch (postTitle: string) {
    return this.Repository.blogSearch(postTitle);
  }
}

export {
  searchService
}