// use serde::{Deserialize, Serialize};
// // use serde_json::*;
// use std::fs;
// use std::fs::File;
// use std::io;
// use std::io::prelude::*;
// use std::path;

// pub struct DB {
//   name: String,
// }
// impl DB {
//   fn build_path(&self, path: &str) -> path::PathBuf {
//     path::Path::new(&self.name).join(path)
//   }
//   pub fn write(&self, path: &str, value: &str) -> io::Result<()> {
//     let path = path::Path::new(path);
//     let mut collection = match File::open(path) {
//       Ok(f) => f,
//       Err(error) => {
//         if error.kind() == io::ErrorKind::NotFound {
//           File::create(path)?
//         } else {
//           panic!("Unable to open file for writing: {}", error);
//         }
//       }
//     };
//     collection.write_all(value.as_bytes())?;
//     Ok(())
//   }
//   pub fn read(&self, path: &str) -> io::Result<String> {
//     let mut contents = String::new();
//     let path = path::Path::new(path);
//     let collection = File::open(path)?;
//     let mut buf_reader = io::BufReader::new(collection);
//     buf_reader.read_to_string(&mut contents)?;
//     Ok(contents)
//   }
//   pub fn delete(&self, path: &str) -> io::Result<()> {
//     let path = self.build_path(path);
//     fs::remove_file(path)?;
//     Ok(())
//   }
// }

// #[derive(Serialize, Deserialize)]
// struct Point {
//   x: i32,
//   y: i32,
// }

// pub struct Collection {
//   name: String,
//   db: DB,
// }

// #[derive(Serialize, Deserialize)]
// struct CollectionDocument {
//   data: Vec<String>,
// }

// enum CollectionError {
//   WriteError,
//   SerializationError,
// }

// impl Collection {
//   pub fn insert_one(&self, record: String) -> io::Result<()> {
//     let collection = self.db.read(&self.name)?;
//     let mut parsed: CollectionDocument = serde_json::from_str(&collection)?;
//     parsed.data.push(record);
//     let string = serde_json::to_string(&parsed)?;
//     self.db.write(&self.name, &string)?;
//     Ok(())
//   }
// }

// #[test]
// fn read_write_collection() {
//   let db = DB {
//     name: "data".to_owned(),
//   };
//   let question = Collection {
//     name: String::from("question"),
//     db,
//   };
//   let test = Point { x: 2, y: 3 };
//   question
//     .insert_one(serde_json::to_string(&test).unwrap())
//     .expect("write error");
//   // let contents = question.read().expect("read error");
//   // assert_eq!(contents, "test");
//   // question.delete().expect("delete error");
//   // assert_eq!(Path::new(question.name.as_str()).exists(), false);
// }

// // pub database;

// // pub struct Document {
// //   name: String,
// // }

// // pub struct Database {
// //   name: String,
// //   path: Path,
// // }
// // pub enum Response {
// //   Success,
// //   Failure,
// // }

// // pub impl Database {
// //   pub fn write(&self, document: Document, collection: Collection) -> Option<Response.Success> {

// //   }
// // }
