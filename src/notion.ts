import { Client } from "@notionhq/client";
import {
  CreateDatabaseParameters,
  CreatePageParameters,
  GetDatabaseParameters,
  GetDatabaseResponse,
  GetPageParameters,
  GetPageResponse,
} from "@notionhq/client/build/src/api-endpoints";

export namespace Notion {
  export type MakeDatabaseParameter = CreateDatabaseParameters;
  export type MakePageParameter = CreatePageParameters;
  export class Api {
    private readonly client: Client;

    constructor(apiKey: string) {
      this.client = new Client({
        auth: apiKey,
      });
    }

    async makeDatabase(query: CreateDatabaseParameters) {
      return this.client.databases.create(query);
    }

    async makePage(query: CreatePageParameters) {
      return this.client.pages.create(query);
    }

    async getDatabase(
      query: GetDatabaseParameters
    ): Promise<GetDatabaseResponse>;
    async getDatabase(id: string): Promise<GetDatabaseResponse>;
    async getDatabase(arg: GetDatabaseParameters | string) {
      let query;
      if (typeof arg === "string") {
        query = {
          database_id: arg,
        };
      } else {
        query = arg;
      }
      return this.client.databases.retrieve(query);
    }

    async getPage(query: GetPageParameters): Promise<GetPageResponse>;
    async getPage(id: string): Promise<GetPageResponse>;
    async getPage(arg: GetPageParameters | string) {
      let query;
      if (typeof arg === "string") {
        query = {
          page_id: arg,
        };
      } else {
        query = arg;
      }
      return this.client.pages.retrieve(query);
    }

    async getChildren(id: string) {
      const query = {
        block_id: id,
        page_size: 100,
      };
      return this.client.blocks.children.list(query);
    }
  }
}
