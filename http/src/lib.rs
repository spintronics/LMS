use std::env;

pub fn get_arg(key: &str) -> Option<String> {
  let args: Vec<Vec<String>> = env::args()
    .map(|arg| arg.split('=').map(|x| x.to_owned()).collect())
    .collect();
  for arg in args {
    if arg.len() > 1 {
      if arg[0] == key {
        return Some(arg[1].to_owned());
      }
    }
  }
  None
}
