# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

#Aggiungi una nuova classe personalizzata nel file actions.py per effettuare la richiesta HTTP e gestire i dati ricevuti. 
#Useremo la libreria requests per inviare la richiesta.
import requests
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List

class ActionGetLessons(Action):
    def name(self) -> Text:
        return "action_get_lessons"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: "Tracker",
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Recupera eventuali parametri dal tracker, come 'start' ed 'end'
        start_date = tracker.get_slot("start_date")  # Slot con la data di inizio
        end_date = tracker.get_slot("end_date")      # Slot con la data di fine

        # URL di base
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
            # Effettua la richiesta GET
            response = requests.get(url, params=params)
            response.raise_for_status()  # Controlla eventuali errori HTTP

            # Decodifica la risposta JSON
            lessons = response.json()

            if lessons:
                # Prepara una risposta leggibile
                message = "Ecco le lezioni disponibili:\n"
                for lesson in lessons:
                    message += f"- {lesson['nome_corso']} il {lesson['data']} dalle {lesson['ora_inizio']} alle {lesson['ora_fine']}.\n"
            else:
                message = "Non ci sono lezioni programmate per il periodo selezionato."

        except Exception as e:
            # Gestione degli errori
            message = f"Si è verificato un errore durante il recupero delle lezioni: {str(e)}"

        # Invia la risposta al client
        dispatcher.utter_message(text=message)
        return []

