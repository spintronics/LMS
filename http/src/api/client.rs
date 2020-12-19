use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::Serialize;
use serde_json::json;
use std::fs;
use std::io;
use std::path::{self, Path, PathBuf};

fn get_files(dir: &Path) -> io::Result<Vec<PathBuf>> {
  if dir.is_dir() {
    let mut paths: Vec<PathBuf> = vec![];
    for entry in fs::read_dir(dir)? {
      // if entry.is
      if entry.is_err() {
        continue;
      }
      let entry = entry.unwrap();
      let path = entry.path();
      if path.is_dir() {
        paths.append(&mut get_files(&path).unwrap_or_default());
      } else {
        paths.push(path);
      }
    }
    return Ok(paths);
  }
  Ok(vec![])
}

#[get("/api/lms/questions")]
async fn questions() -> impl Responder {
  match get_files(path::Path::new("../client/questions")) {
    Ok(paths) => {
      let paths: Vec<String> = paths
        .iter()
        .map(|path| {
          String::from(
            path
              // .iter()
              // .fold(String::new(), |acc, x| acc + x.unwrap_or_default())
              .to_str()
              .unwrap_or_default(),
          )
        })
        .filter(|path| !path.is_empty())
        .collect();
      // let body = serde_json::to_string(&paths).unwrap_or_default();
      let body = json!({
        "success": true,
        "data": &paths
      });
      HttpResponse::Ok()
        .content_type("application/json")
        .body(body)
    }
    Err(e) => HttpResponse::Ok().body(e.to_string()),
  }
}

// #[post("/echo")]
// async fn echo(req_body: String) -> impl Responder {
//     HttpResponse::Ok().body(req_body)
// }
