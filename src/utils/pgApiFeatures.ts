import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

class PgApiFeatures<T extends ObjectLiteral> {
     constructor(private query: SelectQueryBuilder<T>, private queryString: any, private table: string) { }

     // filtering
     filter() {
          const queryObj = { ...this.queryString };
          const excludeFields = ['page', 'sort', 'order', 'limit', 'fields', 'search'];
          excludeFields.forEach(el => delete queryObj[el]);
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
          if (Object.keys(JSON.parse(queryStr)).length > 0) {
               this.query = this.query.where(JSON.parse(queryStr));
          }
          return this;
     }

     // sorting
     sort() {
          if (this.queryString.sort && this.queryString.order) {
               const sortBy = this.queryString.sort.split(",").map((field: any) => `${this.table}.${field}`).join(" ");
               const order = this.queryString.order.toUpperCase();
               this.query = this.query.orderBy(sortBy, order);
          } else {
               this.query = this.query.orderBy('users.createdAt', 'DESC');
          }
          return this;
     }

     // limit fields
     limitFields() {
          if (this.queryString.fields) {
               const fields = this.queryString.fields.split(',').map((field: string) => `${this.table}.${field}`);
               this.query = this.query.select(fields);
          }
          return this;
     }

     // pagination
     paginate() {
          const page = this.queryString.page * 1 || 1;
          const limit = this.queryString.limit * 1 || 100;
          const skip = (page - 1) * limit;
          this.query = this.query.skip(skip).take(limit);
          return this;
     }

     // search
     search(searchFields: string[]) {
          if (this.queryString.search) {
               const searchQuery = searchFields.map(field => `${this.table}.${field} LIKE :search`).join(' OR ');
               this.query = this.query.andWhere(searchQuery, { search: `%${this.queryString.search}%` });
          }
          return this;
     }

     // get query
     getQuery() {
          return this.query;
     }
}

export default PgApiFeatures;