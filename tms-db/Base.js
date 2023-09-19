export default class Base {
  static db

  static query(sql, ...args) {
    return Base.db.query(sql, ...args)
  }
}
