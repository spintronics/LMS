use actix_files as fs;
use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder};

// #[get("/")]
// async fn hello() -> impl Responder {
//   HttpResponse::Ok().body("Hello world!")
// }

// #[post("/echo")]
// async fn echo(req_body: String) -> impl Responder {
//   HttpResponse::Ok().body(req_body)
// }

// async fn manual_hello() -> impl Responder {
//   HttpResponse::Ok().body("Hey there!")
// }

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  HttpServer::new(|| {
    App::new()
      .wrap(middleware::Logger::default())
      .service(fs::Files::new(".*", "../client").show_files_listing())
    // .route("/hey", web::get().to(manual_hello))
  })
  .bind("127.0.0.1:8080")?
  .run()
  .await
}
