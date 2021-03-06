import { ServerRespond } from "./DataStreamer";

export interface Row {
  //change to match expected graph schema parameters in graph.tsx
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    // set bounds
    // modify to change it should be +- 10% of 90 day average ratio but i'm not sure how get that average
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp:
        // use the newest timestamp
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined
    };
  }
}
