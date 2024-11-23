import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
from datetime import datetime
import pytz


class ActionGetLessons(Action):
    def name(self) -> Text:
        return "action_get_lessons"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Recupera i parametri dal tracker
        start_date_raw = tracker.get_slot("start_date")
        end_date_raw = tracker.get_slot("end_date")

        # Verifica che start_date e end_date siano presenti
        if not start_date_raw or not end_date_raw:
            dispatcher.utter_message(text="Le date di inizio e fine non sono specificate. Per favore riprova.")
            return []

        # Converte le date nel formato ISO 8601 richiesto
        try:
            start_date = datetime.strptime(start_date_raw, "%d %B").replace(
                year=datetime.now().year, tzinfo=pytz.timezone("Europe/Rome")
            ).isoformat()
            end_date = datetime.strptime(end_date_raw, "%d %B").replace(
                year=datetime.now().year, tzinfo=pytz.timezone("Europe/Rome")
            ).isoformat()
        except ValueError:
            dispatcher.utter_message(text="Le date fornite non sono valide. Per favore usa il formato 'gg mese'.")
            return []

        # Costruisce i parametri dinamici della richiesta
        url = "https://unifare.unicam.it/controller/ajaxController.php"
        params = {
            "filename": "../didattica/controller/orari.php",
            "class": "OrariController",
            "method": "getDateLezioniByPercorsoCalendar",
            "parametri[]": ["10028", "false", "0"],
            "start": start_date,
            "end": end_date
        }

        try:
            # Invia la richiesta al server
            response = requests.get(url, params=params)
            response.raise_for_status()

            # Log per debug
            print(f"Risposta del server: {response.text}")

            # Verifica se il server restituisce un JSON valido
            if response.headers.get("Content-Type") == "application/json":
                lessons = response.json()
                if lessons:
                    message = "Ecco le lezioni disponibili:\n"
                    for lesson in lessons:
                        message += (
                            f"- {lesson['nome_corso']} il {lesson['data']} "
                            f"dalle {lesson['ora_inizio']} alle {lesson['ora_fine']}.\n"
                        )
                else:
                    message = "Non ci sono lezioni programmate per il periodo selezionato."
            else:
                message = f"Errore: la risposta del server non è in formato JSON. Tipo di contenuto ricevuto: {response.headers.get('Content-Type')}"

        except requests.exceptions.RequestException as e:
            # Gestisce gli errori di rete
            message = f"Errore di rete durante la richiesta delle lezioni: {str(e)}"
        except ValueError as e:
            # Gestisce errori nel formato della risposta
            message = f"Errore nel formato della risposta: {str(e)}"

        # Invia il messaggio di risposta
        dispatcher.utter_message(text=message)
        return []


class ActionProvideCourseInfo(Action):
    def name(self) -> Text:
        return "action_provide_course_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Log per debug
        print("Ciao sono Dave")

        # Risposta dell'azione
        dispatcher.utter_message(text="Sto recuperando le informazioni del corso richiesto.")

        return []
