use simconnect::SimConnector;

pub struct Action {
    pub _id: u32,
    pub _name: ActionName,
    pub excecute_action: Box<dyn Fn(&SimConnector, String, f32, i32)>,
}

impl Action {
    pub const fn new(
        _id: u32,
        _name: ActionName,
        excecute_action: Box<dyn Fn(&SimConnector, String, f32, i32)>,
    ) -> Action {
        Action {
            _id,
            _name,
            excecute_action,
        }
    }

    pub fn excecute_action(
        &self,
        connector: &SimConnector,
        input: String,
        modifier: f32,
        adc_res: i32,
    ) {
        (self.excecute_action)(connector, input, modifier, adc_res)
    }
}

pub enum ActionName {
    Throttle,
    Prop,
    Mixture,
}
