class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex }
        ]
      });
    }
    return this;
  }

  filter() {
    const filterableFields = ['role'];
    const filterCriteria = {};

    filterableFields.forEach((field) => {
      if (this.queryString[field]) {
        filterCriteria[field] = this.queryString[field];
      }
    });

    if (Object.keys(filterCriteria).length) {
      this.query = this.query.find(filterCriteria);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;

    return this;
  }
}

module.exports = APIFeatures;
