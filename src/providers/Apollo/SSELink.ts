import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from "@apollo/client/core";
import { print } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-sse";
import { BASE_URL } from "./constants";
import { auth } from "./auth";

export class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      );
    });
  }
}

export const link = new SSELink({
  url: `http://${BASE_URL}/graphql`,
  headers: auth,
});
