#!/usr/bin/env python3
"""
Seed script to populate 22 French preventive maintenance tasks
This script creates a complete preventive maintenance plan with all 22 tasks
from the French maintenance checklist
"""

import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from app import create_app
from app.models import db, PreventiveMaintenancePlan, PreventiveMaintenanceTask, Machine, User
from datetime import date, timedelta

# Create app context
app = create_app()

# List of 22 French maintenance tasks with complete details
MAINTENANCE_TASKS = [
    {
        "task_number": 1,
        "task_description": "Vérifier le système de sécurité de la machine (Arrêt d'urgence, marche-Arrêt…)",
        "category": "Safety",
        "estimated_duration_minutes": 15,
        "required_materials": "Aucun",
        "safety_precautions": "Arrêter complètement la machine avant d'effectuer cette vérification",
        "notes": "Vérifier que chaque arrêt d'urgence est capable d'arrêter la machine. Chaque arrêt fonctionnel.",
        "method": "I"
    },
    {
        "task_number": 2,
        "task_description": "Vérifier l'état des accessoires liés au poste de travail (loupe, mètre, support d'éclairage…)",
        "category": "Accessories",
        "estimated_duration_minutes": 10,
        "required_materials": "Accessoires de vérification",
        "safety_precautions": "Utiliser les équipements de protection appropriés",
        "notes": "Les accessoires doivent exister et être en bon état",
        "method": "N"
    },
    {
        "task_number": 3,
        "task_description": "Faire une purge pour évacuer l'eau accumulée dans le conditionneur",
        "category": "Hydraulic",
        "estimated_duration_minutes": 20,
        "required_materials": "Bac de récupération, outils",
        "safety_precautions": "Placer le bac avant d'ouvrir la purge",
        "notes": "Ouvrir la purge pendant 1 minute. Voir fig 001",
        "method": "I"
    },
    {
        "task_number": 4,
        "task_description": "Contrôler l'œil enduit pour câble",
        "category": "Electrical",
        "estimated_duration_minutes": 10,
        "required_materials": "Aucun",
        "safety_precautions": "Vérifier l'isolation des câbles",
        "notes": "Pas d'usure. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 5,
        "task_description": "Vérifier la mobilité des roulements des redressement",
        "category": "Mechanical",
        "estimated_duration_minutes": 15,
        "required_materials": "Aucun",
        "safety_precautions": "Écouter attentivement le fonctionnement",
        "notes": "Aucun bruit lors du fonctionnement. Inspection sensorielle",
        "method": "O"
    },
    {
        "task_number": 6,
        "task_description": "Vérifier l'usure des courroies, roues dentées et roulement",
        "category": "Mechanical",
        "estimated_duration_minutes": 20,
        "required_materials": "Outils d'inspection",
        "safety_precautions": "Arrêter la machine avant l'inspection",
        "notes": "Pas d'usures, pas de bavures. Voir fig 002. Inspection manuelle",
        "method": "I"
    },
    {
        "task_number": 7,
        "task_description": "Vérifier et nettoyer la roue d'encoudeur avec une brosse en cuivre",
        "category": "Mechanical",
        "estimated_duration_minutes": 25,
        "required_materials": "Brosse en cuivre, chiffon",
        "safety_precautions": "Utiliser une brosse adaptée pour ne pas endommager",
        "notes": "Aucune usure et aucune bavure sur la roue d'encoudeur. Voir fig 003. Inspection manuelle",
        "method": "I"
    },
    {
        "task_number": 8,
        "task_description": "Vérifier la mobilité des pinces (grippers)",
        "category": "Mechanical",
        "estimated_duration_minutes": 15,
        "required_materials": "Aucun",
        "safety_precautions": "Vérifier en mode manuel seulement",
        "notes": "Lors d'activation de l'option Basculer, les sorties aucune coincement de pinces. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 9,
        "task_description": "Vérifier l'état des couteaux",
        "category": "Mechanical",
        "estimated_duration_minutes": 20,
        "required_materials": "Jauge de mesure",
        "safety_precautions": "Faire attention aux arêtes tranchantes",
        "notes": "Pas d'usure. Voir fig 004. Produire 3 échantillons. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 10,
        "task_description": "Vérifier la tension du courroie transporteuse",
        "category": "Mechanical",
        "estimated_duration_minutes": 20,
        "required_materials": "Jauge de 0,35mm",
        "safety_precautions": "Arrêter la machine avant d'ajuster",
        "notes": "Jeux entre tapis et reglette = 0,35mm. Voir fig 005. Inspection manuelle",
        "method": "I"
    },
    {
        "task_number": 11,
        "task_description": "Vérifier le bon fonctionnement du ventilateur du coffret électrique",
        "category": "Electrical",
        "estimated_duration_minutes": 10,
        "required_materials": "Aucun",
        "safety_precautions": "Vérifier en conditions d'utilisation normales",
        "notes": "Aucun coincement. Inspection visuelle et sensorielle",
        "method": "O"
    },
    {
        "task_number": 12,
        "task_description": "Positionner à zéro les deux bras de pivottement",
        "category": "Mechanical",
        "estimated_duration_minutes": 25,
        "required_materials": "Outils de calibrage",
        "safety_precautions": "Utiliser les outils de calibrage appropriés",
        "notes": "Les deux bras doivent être alignés avec le bloc de lame. Utiliser outils de calibrage fig 006",
        "method": "I"
    },
    {
        "task_number": 13,
        "task_description": "Vérifier les manomètres de pression",
        "category": "Hydraulic",
        "estimated_duration_minutes": 15,
        "required_materials": "Manomètre de référence",
        "safety_precautions": "Lire les valeurs en conditions stables",
        "notes": "Principal: 6-8 bar, Entraînement: 1,5-2,5 bar, Presse: 4-8 bar. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 14,
        "task_description": "Vérification de l'étalonnage des presses",
        "category": "Mechanical",
        "estimated_duration_minutes": 30,
        "required_materials": "Outils d'étalonnage ref. fig 007",
        "safety_precautions": "Suivre la procédure d'étalonnage",
        "notes": "Cycle de presse correspond à un tour complet outil d'étalonnage. Utiliser outils d'étalonnage ref: fig 007",
        "method": "I"
    },
    {
        "task_number": 15,
        "task_description": "Vérification les paramètres TOP WIN (CFA, tolérance de fil, longueur de dénudage...)",
        "category": "Electrical",
        "estimated_duration_minutes": 20,
        "required_materials": "Accès à TOP WIN",
        "safety_precautions": "Ne pas modifier les paramètres critiques",
        "notes": "Les options de modification produit dans la session opérateur doivent être désactivées. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 16,
        "task_description": "Vérifiez que l'air comprimé sec seulement est utilisé",
        "category": "Pneumatic",
        "estimated_duration_minutes": 15,
        "required_materials": "Hygromètre d'air",
        "safety_precautions": "Vérifier l'installation du sécheur d'air",
        "notes": "Seulement l'air sec est utilisé. Inspection manuelle",
        "method": "I"
    },
    {
        "task_number": 17,
        "task_description": "Vérifiez le mouvement d'unité de redressement",
        "category": "Mechanical",
        "estimated_duration_minutes": 15,
        "required_materials": "Aucun",
        "safety_precautions": "Vérifier en mode manuel",
        "notes": "Mouvement facile d'unité. Inspection manuelle",
        "method": "I"
    },
    {
        "task_number": 18,
        "task_description": "Vérifier le réglage correct de l'unité de dressage",
        "category": "Mechanical",
        "estimated_duration_minutes": 20,
        "required_materials": "Outils de mesure",
        "safety_precautions": "Arrêter la machine avant le réglage",
        "notes": "La distance entre doigt doit être supérieure à la sortie. Voir fig 008",
        "method": "N"
    },
    {
        "task_number": 19,
        "task_description": "Vérifier la déplacement des bras",
        "category": "Mechanical",
        "estimated_duration_minutes": 15,
        "required_materials": "Aucun",
        "safety_precautions": "Vérifier en mode manuel",
        "notes": "Déplacement facile. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 20,
        "task_description": "Vérifier les griffes de serrage de base outil usées ou non serrées",
        "category": "Mechanical",
        "estimated_duration_minutes": 20,
        "required_materials": "Outils d'inspection",
        "safety_precautions": "Vérifier une fois l'outil entièrement fixé",
        "notes": "L'outil est strictement fixé après montage. Inspection visuelle",
        "method": "N"
    },
    {
        "task_number": 21,
        "task_description": "Vérification de la longueur",
        "category": "Quality",
        "estimated_duration_minutes": 25,
        "required_materials": "Mètre de précision, 5 pièces test de 2000mm",
        "safety_precautions": "Utiliser des instruments de précision",
        "notes": "Aucune variation de longueur pour les échantillons produits. Tous les pièces doivent être dans l'intervalle de tolérance. Pour 2000mm: tolérance (+-) 4mm suite PPE-MM-TN-024. Mesurer 5 pièces.",
        "method": "N"
    },
    {
        "task_number": 22,
        "task_description": "Documentation et signature du rapport de maintenance",
        "category": "Administrative",
        "estimated_duration_minutes": 15,
        "required_materials": "Rapport",
        "safety_precautions": "Aucune",
        "notes": "Documenter tous les travaux effectués, les observations et les problèmes rencontrés. Le technician doit signer le rapport.",
        "method": "N"
    }
]

def create_preventive_maintenance_plan():
    """Create a UNIVERSAL preventive maintenance plan with all 22 tasks (applies to all machines)"""
    
    with app.app_context():
        # Check if plan already exists
        existing_plan = PreventiveMaintenancePlan.query.filter_by(
            plan_name="Plan de Maintenance Préventive Complet (22 Tâches)"
        ).first()
        
        if existing_plan:
            print(f"✓ Universal maintenance plan already exists (ID: {existing_plan.id})")
            return existing_plan.id
        
        # Get admin/supervisor user to create the plan
        admin_user = User.query.filter_by(role='admin').first()
        if not admin_user:
            admin_user = User.query.filter_by(role='supervisor').first()
        
        if not admin_user:
            print("✗ No admin or supervisor user found.")
            return None
        
        # Create UNIVERSAL plan (NOT tied to a specific machine)
        # machine_id is NULL so this can be used for ANY machine
        plan = PreventiveMaintenancePlan(
            plan_name="Plan de Maintenance Préventive Complet (22 Tâches)",
            machine_id=None,  # UNIVERSAL - no specific machine
            frequency_type="monthly",
            frequency_days=30,
            description="Plan complet de maintenance préventive avec 22 tâches couvrant tous les aspects de la machine. Ce plan s'applique à TOUTES les machines.",
            is_active=True,
            created_by_id=admin_user.id,
            next_planned=date.today()
        )
        db.session.add(plan)
        db.session.flush()  # Get plan ID
        
        print(f"\n✓ Created UNIVERSAL maintenance plan: '{plan.plan_name}' (ID: {plan.id})")
        print(f"  Type: Universal (applies to ALL machines)")
        print(f"  Frequency: {plan.frequency_type} ({plan.frequency_days} days)\n")
        
        # Add all 22 tasks
        print("Adding 22 maintenance tasks...")
        for task_data in MAINTENANCE_TASKS:
            task = PreventiveMaintenanceTask(
                plan_id=plan.id,
                task_number=task_data["task_number"],
                task_description=task_data["task_description"],
                category=task_data["category"],
                estimated_duration_minutes=task_data["estimated_duration_minutes"],
                required_materials=task_data["required_materials"],
                safety_precautions=task_data["safety_precautions"],
                notes=task_data["notes"],
                method=task_data.get("method", "N")
            )
            db.session.add(task)
            print(f"  Task {task_data['task_number']:2d}: {task_data['task_description'][:50]}... ({task_data['estimated_duration_minutes']} min)")
        
        db.session.commit()
        
        # Calculate total estimated duration
        total_duration = sum(t["estimated_duration_minutes"] for t in MAINTENANCE_TASKS)
        print(f"\n✓ Successfully created {len(MAINTENANCE_TASKS)} maintenance tasks")
        print(f"✓ Total estimated maintenance time: {total_duration} minutes ({total_duration // 60}h {total_duration % 60}m)")
        print(f"\n✓ Universal Plan ID: {plan.id}")
        print(f"✓ This plan will be available for ALL machines")
        
        return plan.id

if __name__ == '__main__':
    print("="*70)
    print("French Preventive Maintenance Plan Seeder")
    print("="*70)
    
    try:
        plan_id = create_preventive_maintenance_plan()
        if plan_id:
            print("\n✓ Seeding completed successfully!")
            print(f"✓ Universal maintenance plan created (ID: {plan_id})")
            print(f"✓ You can now schedule this plan for ANY machine")
            print(f"✓ Go to: Preventive Maintenance → Plans → Schedule Execution → Select Machine")
        else:
            print("\n✗ Seeding failed - check errors above")
            sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error during seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
