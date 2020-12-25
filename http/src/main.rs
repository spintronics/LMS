use actix_files as fs;
use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder};

mod api;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  std::env::set_var("RUST_LOG", "actix_web=info");
  HttpServer::new(|| {
    App::new()
      .service(api::client::questions)
      .service(api::services::select_question)
      .service(fs::Files::new(".*", "../client").show_files_listing())
      .wrap(middleware::Logger::default())
  })
  .bind("127.0.0.1:8080")?
  .run()
  .await
}
