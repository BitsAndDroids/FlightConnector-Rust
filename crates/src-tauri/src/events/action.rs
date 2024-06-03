use simconnect::SimConnector;

pub struct Action {
    pub id: u32,
    pub name: ActionName,
    pub excecute_action: Box<dyn Fn(&SimConnector, String)>,
}

impl Action {
    pub const fn new(
        id: u32,
        name: ActionName,
        excecute_action: Box<dyn Fn(&SimConnector, String)>,
    ) -> Action {
        Action {
            id,
            name,
            excecute_action,
        }
    }

    pub fn excecute_action(&self, connector: &SimConnector, input: String) {
        (self.excecute_action)(connector, input)
    }
}

pub enum ActionName {
    THROTTLE,
    PROP,
    MIXTURE,
    RUDDER,
    AILERON,
}
