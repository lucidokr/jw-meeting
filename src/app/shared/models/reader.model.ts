export class Reader {

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  _id: string;
  date: any = this.randomDate(new Date(2017, 2, 1), new Date());
  prevDate: any = this.randomDate(new Date(2017, 2, 1), new Date());
  enabled: boolean = true;
}
