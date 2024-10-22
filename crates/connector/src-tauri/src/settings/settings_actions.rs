use connector_types::types::action_response::ActionResponse;

#[tauri::command]
pub fn toggle_run_on_sim_launch(enable: bool, exe_xml_path: String) -> ActionResponse {
    let file_content = match std::fs::read_to_string(&exe_xml_path) {
        Ok(file) => file,
        Err(e) => {
            return ActionResponse {
                status: connector_types::types::action_response::ActionResponseStatus::Error,
                message: format!("Failed to open file: {:?}", e),
            }
        }
    };

    let exe_path = std::env::current_exe().unwrap();

    let new_content = format!(
        "
        <Launch.Addon>
                <Name>Bits and Droids FlightConnector</Name>
                <Disabled>False</Disabled>
                <Path>{}</Path>
                <CommandLine>sim</CommandLine>
        </Launch.Addon>",
        exe_path.to_str().unwrap()
    );

    let file_content = match enable {
        true => add_launch_addon_section_entry(&file_content, &new_content),
        false => remove_launch_addon_section_entry(&file_content, &new_content),
    };

    //write new content to file
    match std::fs::write(&exe_xml_path, file_content.clone()) {
        Ok(_) => {}
        Err(e) => {
            return ActionResponse {
                status: connector_types::types::action_response::ActionResponseStatus::Error,
                message: format!("Failed to write to file: {:?}", e),
            }
        }
    }

    ActionResponse {
        status: connector_types::types::action_response::ActionResponseStatus::Success,
        message: "Success".to_string(),
    }
}

fn remove_launch_addon_section_entry(file_content: &str, content_to_remove: &str) -> String {
    println!("Removing content: {}", content_to_remove);
    let index_string = content_to_remove;
    let index_start_add_on_section = match file_content.find(index_string) {
        Some(index) => index,
        None => return file_content.to_string(),
    };
    let index_end_add_on_section = file_content[index_start_add_on_section..]
        .find("</Launch.Addon>")
        .unwrap();
    format!(
        "{}{}",
        &file_content[..index_start_add_on_section],
        &file_content
            [index_start_add_on_section + index_end_add_on_section + "</Launch.Addon>".len()..]
    )
}

fn add_launch_addon_section_entry(file_content: &str, content_to_add: &str) -> String {
    let index_string = "	<Disabled>False</Disabled>";
    let index_start_add_on_section = file_content.find(index_string).unwrap();
    //insert new content after index_start_add_on_section
    format!(
        "{}{}{}",
        &file_content[..index_start_add_on_section + index_string.len()],
        content_to_add,
        &file_content[index_start_add_on_section + index_string.len()..]
    )
}
