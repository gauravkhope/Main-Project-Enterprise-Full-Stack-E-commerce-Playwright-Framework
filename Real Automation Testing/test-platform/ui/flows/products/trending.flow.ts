import { TrendingComponent } from '../../components/trending.component';

export class TrendingFlow {
  constructor(private trending: TrendingComponent) {}

  async openHome() {
    await this.trending.navigate();
  }

  async goNext() {
    await this.trending.clickNext();
  }

  async goPrev() {
    await this.trending.clickPrev();
  }

  async openFirstProduct() {
    await this.trending.clickFirstProduct();
  }
}