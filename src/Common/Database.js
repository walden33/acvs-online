///////////////////////////////////////////////////////////////////////////////
///
/// An abstraction for a database-like object containing tables of records.
///
/// db = new Database();
/// db.add_new_table("table1");
/// db.table1.add_new_column("col1");
/// db.table1.add_new_column("col2");
/// db.table1.add_new_column("col3");
///
/// db.finalize(); // lock structure
///
/// db.table1.add_new_row(valA1, valB1, valC1);
/// db.table1.add_new_row(valA2, valB2, valC2);
///
/// console.log(db);
/// >> {table1: {col1:         [valA1,     valA2   ],
///              col2:         [valB1,     valB2   ],
///              col3:         [valC1,     valC2   ],
///              rowIndex:     [1,         2       ],
///              rowTimestamp: [0.1231..., 0.231...] } }
///
util.Database = class {
  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Called on instantiation.
  ///
  constructor () {
    // timestamp for when this object was created
    this._time_instantiated = performance.now();
    // an array containing the names of the tables in this db
    this._array_of_table_names = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Add a new table to this db.
  ///
  add_new_table (table_name) {
    // record the new table's name
    this._array_of_table_names.push(table_name);
    // create the new table
    this[table_name] = new util.Table(this._time_instantiated);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Call this method after all tables have been added to lock the structure
  /// of the db.
  ///
  finalize () {
    // call finalize on all tables in the db
    for (let i = 0; i < this._array_of_table_names.length; i++) {
      this[this._array_of_table_names[i]].finalize();
    }
    // delete the methods that can be used to modify the structure of the db
    delete this.add_new_table;
    delete this.finalize;
  }
}

///////////////////////////////////////////////////////////////////////////////
///
/// An abstraction for a database table.
///
util.Table = class {
  constructor (absolute_timestamp) {
    // initial timestamp for use in all subsequent timestamps:
    this._absolute_timestamp = absolute_timestamp;
    // for internal bookkeeping:
    this._array_of_column_names = [];
    // automatically populated columns:
    this["RowTimestamp"] = [];
    this["RowIndex"] = [];
    this["RowHash"] = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Return the number of rows in this table or 0 if the table has no columns.
  ///
  number_of_rows () {
    if (this._array_of_column_names.length == 0) {
      return 0;
    } else {
      return this[this._array_of_column_names[0]].length;
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Append a new column to the table.
  ///
  add_new_column (column_name) {
    // record the column name
    this._array_of_column_names.push(column_name);
    // create an empty array to represent the column
    this[column_name] = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Append a new row/record to this table.
  ///
  add_new_row () {
    // automatically timestamp when this row is added
    this["RowTimestamp"].push(performance.now() - this._absolute_timestamp);
    // automatically add an index number for this row
    this["RowIndex"].push(this[this._array_of_column_names[0]].length + 1);
    // automatically add a hash of the previous row
    let num_rows = this.number_of_rows();
    if (num_rows > 0) {
      let previous_row_as_string = JSON.stringify(this.get_row(num_rows - 1));
      this["RowHash"].push(util.Hash.sha256(previous_row_as_string))
    } else {
      this["RowHash"].push("init")
    }
    // add the arguments given to this function as elements for the row
    for (let i = 0; i < this._array_of_column_names.length; i++) {
      this[this._array_of_column_names[i]].push(arguments[i]);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Return an array containing the contents of the table at row_index.
  /// Note: primitives are likely returned *by-copy* and objects *by-reference*
  /// within the new array.
  ///
  get_row (row_index) {
    let result = [];
    result.push(this["RowTimestamp"][row_index]);
    result.push(this["RowIndex"][row_index]);
    result.push(this["RowHash"][row_index]);
    for (let i = 0; i < this._array_of_column_names.length; i++) {
      result.push(this[this._array_of_column_names[i]][row_index]);
    }
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Call to lock the structure of this table by deleting the mutator methods.
  ///
  finalize () {
    delete this.add_new_column;
    delete this.finalize;
  }
}
