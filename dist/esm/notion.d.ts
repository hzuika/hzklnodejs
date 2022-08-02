import { CreateDatabaseParameters, CreatePageParameters, GetDatabaseParameters, GetDatabaseResponse, GetPageParameters, GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
export declare namespace Notion {
    class Api {
        private readonly client;
        constructor(apiKey: string);
        makeDatabase(query: CreateDatabaseParameters): Promise<import("@notionhq/client/build/src/api-endpoints").CreateDatabaseResponse>;
        makePage(query: CreatePageParameters): Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
        getDatabase(query: GetDatabaseParameters): Promise<GetDatabaseResponse>;
        getDatabase(id: string): Promise<GetDatabaseResponse>;
        getPage(query: GetPageParameters): Promise<GetPageResponse>;
        getPage(id: string): Promise<GetPageResponse>;
    }
}
//# sourceMappingURL=notion.d.ts.map