use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use json;

#[post("/api/.*")]
pub async fn question(req_body: String) -> impl Responder {
  let empty_response = json::object! {
    success: true,
    data: {
      content: "what is the meaning of life?"
    }
  };
  HttpResponse::Ok().body(json::stringify(empty_response))
}
