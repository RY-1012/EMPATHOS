// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};
use std::sync::{Arc, Mutex};

mod database;
mod emotional_api;

use database::Database;
use emotional_api::EmotionalState;

#[tauri::command]
fn get_emotional_state(state: tauri::State<Arc<Mutex<EmotionalState>>>) -> Result<EmotionalState, String> {
    let emotional_state = state.lock().map_err(|e| e.to_string())?;
    Ok(emotional_state.clone())
}

#[tauri::command]
fn update_emotional_state(
    new_state: EmotionalState,
    state: tauri::State<Arc<Mutex<EmotionalState>>>,
    db: tauri::State<Arc<Mutex<Database>>>
) -> Result<(), String> {
    let mut emotional_state = state.lock().map_err(|e| e.to_string())?;
    *emotional_state = new_state.clone();
    
    let database = db.lock().map_err(|e| e.to_string())?;
    database.log_emotional_state(&new_state).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_emotional_history(
    limit: i32,
    db: tauri::State<Arc<Mutex<Database>>>
) -> Result<Vec<EmotionalState>, String> {
    let database = db.lock().map_err(|e| e.to_string())?;
    database.get_emotional_history(limit).map_err(|e| e.to_string())
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show Dashboard");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    let db = Arc::new(Mutex::new(Database::new().expect("Failed to initialize database")));
    let emotional_state = Arc::new(Mutex::new(EmotionalState::default()));

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "show" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .manage(db)
        .manage(emotional_state)
        .invoke_handler(tauri::generate_handler![
            get_emotional_state,
            update_emotional_state,
            get_emotional_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
