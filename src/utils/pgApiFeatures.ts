import { Brackets, ObjectLiteral, SelectQueryBuilder } from "typeorm";

class PgApiFeatures<T extends ObjectLiteral> {
     constructor(private query: SelectQueryBuilder<T>, private queryString: any, private alias: string) { }

     // filtering
     filter() {
          const queryObj = { ...this.queryString };
          const excludeFields = ['page', 'sort', 'order', 'limit', 'search', 'fields'];
          excludeFields.forEach(el => delete queryObj[el]);
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
          if (Object.keys(JSON.parse(queryStr)).length > 0) {
               this.query = this.query.andWhere(JSON.parse(queryStr));
          }
          return this;
     }

     // sorting
     sort() {
          if (this.queryString.sort && this.queryString.order) {
               const sortBy = this.queryString.sort.split(",").map((field: any) => `${this.alias}.${field}`).join(" ");
               const order = this.queryString.order.toUpperCase();
               this.query = this.query.orderBy(sortBy, order);
          } else {
               this.query = this.query.orderBy(`${this.alias}.createdAt`, 'DESC');
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
               const searchQuery = searchFields.map(field => `${this.alias}.${field} LIKE :search`).join(' OR ');
               this.query = this.query.andWhere(new Brackets(qb => {
                    qb.where(searchQuery, { search: `%${this.queryString.search}%` });
               }));
          }
          return this;
     }

     // limit fields
     limitFields() {
          if (this.queryString.fields) {
               const fields = this.queryString.fields.split(',').map((field: string) => {
                    const [a, f] = field.split(".");
                    return `${a}.${f}`
               });

               this.query = this.query.select(fields);
          }
          return this;
     }

     // get query
     getQuery() {
          return this.query;
     }
}

export default PgApiFeatures;