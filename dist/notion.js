"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notion = void 0;
const client_1 = require("@notionhq/client");
var Notion;
(function (Notion) {
    class Api {
        client;
        constructor(apiKey) {
            this.client = new client_1.Client({
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
        async getChildren(id) {
            const query = {
                block_id: id,
                page_size: 100,
            };
            return this.client.blocks.children.list(query);
        }
    }
    Notion.Api = Api;
})(Notion = exports.Notion || (exports.Notion = {}));
