use std::pin::Pin;
use std::task::{Context, Poll};

use actix_service::{Service, Transform};
use actix_web::{dev::ServiceRequest, dev::ServiceResponse, http, Error, HttpResponse};
use futures::future::{ok, Either, Ready};
use futures::Future;

// https://actix.rs/docs/middleware/

// There are two steps in middleware processing.
// 1. Middleware initialization, middleware factory gets called with
//    next service in chain as parameter.
// 2. Middleware's call method gets called with normal request.
pub struct RewriteIndex;

// Middleware factory is `Transform` trait from actix-service crate
// `S` - type of the next service
// `B` - type of response's body
impl<S, B> Transform<S> for RewriteIndex
where
  S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
  S::Future: 'static,
  B: 'static,
{
  type Request = ServiceRequest;
  type Response = ServiceResponse<B>;
  type Error = Error;
  type InitError = ();
  type Transform = RewriteIndexMiddleware<S>;
  type Future = Ready<Result<Self::Transform, Self::InitError>>;

  fn new_transform(&self, service: S) -> Self::Future {
    ok(RewriteIndexMiddleware { service })
  }
}

pub struct RewriteIndexMiddleware<S> {
  service: S,
}

impl<S, B> Service for RewriteIndexMiddleware<S>
where
  S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
  S::Future: 'static,
  // B: 'static,
{
  type Request = ServiceRequest;
  type Response = ServiceResponse<B>;
  type Error = Error;
  // type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>>>>;
  type Future = Either<S::Future, Ready<Result<Self::Response, Self::Error>>>;

  fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
    self.service.poll_ready(cx)
  }

  fn call(&mut self, req: ServiceRequest) -> self::Future {
    println!("Hi from start. You requested: {}", req.path());

    if req.path() == "/" {
      Either::Right(ok(
        req.into_response(
          HttpResponse::build(http::StatusCode::OK)
            .header(http::header::LOCATION, "/index.html")
            .finish()
            .into_body(),
        ),
      ))
    } else {
      Either::Left(self.service.call(req))
    }

    // Box::pin(async move {
    //   let res = fut.await?;

    //   println!("Hi from response");
    //   Ok(res)
    // })
  }
}
