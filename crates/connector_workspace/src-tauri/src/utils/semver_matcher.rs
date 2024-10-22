pub fn check_newer_version_available(old: &str, new: &str) -> bool {
    let old = old.split('.').collect::<Vec<&str>>();
    let new = new.split('.').collect::<Vec<&str>>();
    for i in 0..old.len() {
        if old[i].parse::<u32>().unwrap() < new[i].parse::<u32>().unwrap() {
            return true;
        }
    }
    false
}
