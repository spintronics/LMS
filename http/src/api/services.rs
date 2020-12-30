use actix_web::{client, post, HttpResponse, Responder};

/**
 * this is way too verbose to be useful, services should be moved
 * to /services and mapped by port number. client should call /services/{service}/resource...
 * server should route to the appropriate port and assume the client has the right url/configuration
 * middleware can be applied to limit exposure if it matters
 */
#[post("/api/select_question")]
async fn select_question(req_body: String) -> impl Responder {
  let client = client::Client::default();

  let resp = client
    .post("http://localhost:5000/select_question")
    .header("Content-Type", "application/json")
    .send_body(&req_body)
    .await
    .and_then(|mut resp| Ok(resp.body()));

  match resp {
    Ok(resp) => match resp.await {
      Ok(body) => return HttpResponse::Ok().body(body),
      Err(e) => {
        println!("#{}", e);
        return HttpResponse::Ok().body("[]");
      }
    },
    Err(e) => {
      println!("#{}", e);
      return HttpResponse::Ok().body("[]");
    }
  }
}
