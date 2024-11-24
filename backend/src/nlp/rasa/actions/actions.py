import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
from datetime import datetime, timedelta
import pytz
import dateparser


class ActionGetLessons(Action):
    def name(self) -> Text:
        return "action_get_lessons"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Recupera i parametri dal tracker
        start_date_raw = tracker.get_slot("start_date")
        end_date_raw = tracker.get_slot("end_date")
        today = datetime.now(pytz.timezone("Europe/Rome"))

        # Se non sono specificate date, usa default
        if not start_date_raw or not end_date_raw:
            user_message = tracker.latest_message.get('text', '').lower()

            if "oggi" in user_message:
                start_date = today
                end_date = today
            elif "domani" in user_message:
                start_date = today + timedelta(days=1)
                end_date = start_date
            elif "questa settimana" in user_message:
                start_date = today - timedelta(days=today.weekday())
                end_date = start_date + timedelta(days=6)
            elif "questo mese" in user_message:
                start_date = today.replace(day=1)
                end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)
            else:
                start_date = today - timedelta(days=today.weekday())
                end_date = start_date + timedelta(days=6)

        else:
            # Prova a interpretare le date usando dateparser
            start_date = dateparser.parse(start_date_raw, languages=["it"])
            end_date = dateparser.parse(end_date_raw, languages=["it"])
            if not start_date or not end_date:
                dispatcher.utter_message(text="Le date fornite non sono valide. Per favore usa un formato comprensibile.")
                return []

        # Converti le date in formato ISO 8601
        start_date_iso = start_date.astimezone(pytz.timezone("Europe/Rome")).isoformat()
        end_date_iso = end_date.astimezone(pytz.timezone("Europe/Rome")).isoformat()

        # Costruisci l'URL dinamico con i parametri start e end
        base_url = "https://unifare.unicam.it/controller/ajaxController.php"
        url = f"{base_url}?filename=../didattica/controller/orari.php&class=OrariController&method=getDateLezioniByPercorsoCalendar&parametri[]=10028&parametri[]=false&parametri[]=0&start={start_date_iso}&end={end_date_iso}"

        try:
            # Invia la richiesta al server
            response = requests.get(url)
            response.raise_for_status()

            print(f"Risposta del server: {response.text}")

            if response.headers.get("Content-Type") == "application/json":
                lessons = response.json()
                if lessons:
                    message = f"Ecco le lezioni disponibili dal {start_date.strftime('%d %B')} al {end_date.strftime('%d %B')}:\n"
                    for lesson in lessons:
                        message += (
                            f"- {lesson['nome_corso']} il {lesson['data']} "
                            f"dalle {lesson['ora_inizio']} alle {lesson['ora_fine']}.\n"
                        )
                else:
                    message = f"Non ci sono lezioni programmate dal {start_date.strftime('%d %B')} al {end_date.strftime('%d %B')}."
            else:
                message = f"Errore: la risposta del server non è in formato JSON. Tipo di contenuto ricevuto: {response.headers.get('Content-Type')}"

        except requests.exceptions.RequestException as e:
            message = f"Errore di rete durante la richiesta delle lezioni: {str(e)}"

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
