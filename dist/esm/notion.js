import { Client } from "@notionhq/client";
export var Notion;
(function (Notion) {
    class Api {
        client;
        constructor(apiKey) {
            this.client = new Client({
                auth: apiKey,
            });
        }
        async makeDatabase(query) {
            return this.client.databases.create(query);
        }
        async makePage(query) {
            return this.client.pages.create(query);
        }
        async getDatabase(arg) {
            let query;
            if (typeof arg === "string") {
                query = {
                    database_id: arg,
                };
            }
            else {
                query = arg;
            }
            return this.client.databases.retrieve(query);
        }
        async getPage(arg) {
            let query;
            if (typeof arg === "string") {
                query = {
                    page_id: arg,
                };
            }
            else {
                query = arg;
            }
            return this.client.pages.retrieve(query);
        }
    }
    Notion.Api = Api;
})(Notion || (Notion = {}));
