use actix_files as fs;
use actix_web::{middleware, App, HttpServer};

mod api;
mod lib;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  let port = lib::get_arg("port").unwrap_or("8080".to_owned());

  std::env::set_var("RUST_LOG", "actix_web=info");

  HttpServer::new(|| {
    App::new()
      .service(api::client::questions)
      .service(api::services::select_question)
      .service(fs::Files::new(".*", "../client").show_files_listing())
      .wrap(middleware::Logger::default())
  })
  .bind(format!("127.0.0.1:{}", port))?
  .run()
  .await
}
