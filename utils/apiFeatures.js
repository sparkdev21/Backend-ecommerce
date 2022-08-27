const Features=(query, queryStr)=> {
  function search(){
    const keyword =queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    query = query.find({ ...keyword });
    return query;
  }

  function filter() {
    const queryCopy = { ...queryStr };

    // Removing some field for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    query = query.find(queryCopy);
    return this;
  }

  function pagination(resultPerPage) {
    const currentPage = Number(queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    query = query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = Features;
