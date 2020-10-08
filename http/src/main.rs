use actix_files as fs;
use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder};

mod api;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "actix_web=info");
  HttpServer::new(|| {
    App::new()
      .wrap(middleware::Logger::default())
      .service(api::lms::question)
      .service(fs::Files::new(".*", "../client").show_files_listing())
  })
  .bind("127.0.0.1:8080")?
  .run()
  .await
}
