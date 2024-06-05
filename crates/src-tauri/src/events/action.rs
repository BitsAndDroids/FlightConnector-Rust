use simconnect::SimConnector;

pub struct Action {
    pub id: u32,
    pub name: ActionName,
    pub excecute_action: Box<dyn Fn(&SimConnector, String, f32)>,
}

impl Action {
    pub const fn new(
        id: u32,
        name: ActionName,
        excecute_action: Box<dyn Fn(&SimConnector, String, f32)>,
    ) -> Action {
        Action {
            id,
            name,
            excecute_action,
        }
    }

    pub fn excecute_action(&self, connector: &SimConnector, input: String, modifier: f32) {
        (self.excecute_action)(connector, input, modifier)
    }
}

pub enum ActionName {
    THROTTLE,
    PROP,
    MIXTURE,
    RUDDER,
    AILERON,
}
