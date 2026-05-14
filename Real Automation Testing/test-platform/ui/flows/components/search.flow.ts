import { SearchComponent } from '../../components/search.component';

export class SearchFlow {
  constructor(private search: SearchComponent) {}

  async openHome() {
    await this.search.navigate();
  }

  async searchWithKeyword(keyword: string) {
    await this.search.typeKeyword(keyword);
    await this.search.clickSearch();
  }

  async typePartial(keyword: string) {
    await this.search.typeKeyword(keyword);
  }

  async continueTyping(text: string) {
    await this.search.searchInput.type(text);
  }

  async clickFirstSuggestion() {
    await this.search.clickFirstSuggestion();
  }
  async clearInput() {
  await this.search.clearInput();
}

async rapidType(text: string) {
  await this.search.searchInput.type(text, { delay: 20 });
}

async typeWithDelay(text: string) {
  await this.search.searchInput.type(text, { delay: 10 });
}
}