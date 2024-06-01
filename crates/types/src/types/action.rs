pub struct Action {
    pub name: ActionName,
    pub excecute_action: Box<dyn Fn(&str)>,
}

impl Action {
    pub const fn new(name: ActionName, excecute_action: Box<dyn Fn(&str)>) -> Action {
        Action {
            name,
            excecute_action,
        }
    }

    pub fn excecute_action(&self, input: &str) {
        (self.excecute_action)(input)
    }
}

pub enum ActionName {
    THROTTLE,
    PROP,
    MIXTURE,
    RUDDER,
    AILERON,
}
