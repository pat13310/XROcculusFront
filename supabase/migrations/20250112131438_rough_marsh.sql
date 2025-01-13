-- Insérer des modèles de rapports supplémentaires
INSERT INTO report_templates (name, description, type, config)
VALUES
  (
    'Rapport mensuel d''utilisation',
    'Vue d''ensemble mensuelle de l''utilisation des appareils VR, incluant le temps d''utilisation, les applications populaires et les métriques de performance',
    'usage',
    '{
      "metrics": [
        "monthly_active_users",
        "average_session_duration",
        "top_applications",
        "peak_usage_hours"
      ],
      "period": "monthly",
      "charts": ["bar", "line", "pie"]
    }'::jsonb
  ),
  (
    'Audit de sécurité',
    'Analyse complète de la sécurité des appareils, incluant les versions de firmware, les mises à jour en attente et les accès non autorisés',
    'device',
    '{
      "metrics": [
        "firmware_versions",
        "pending_updates",
        "unauthorized_access_attempts",
        "security_patches"
      ],
      "severity_levels": ["critical", "warning", "info"]
    }'::jsonb
  ),
  (
    'Analyse des performances réseau',
    'Évaluation détaillée des performances réseau pour tous les appareils VR connectés',
    'performance',
    '{
      "metrics": [
        "latency",
        "bandwidth_usage",
        "packet_loss",
        "connection_stability"
      ],
      "thresholds": {
        "latency_max": 50,
        "packet_loss_max": 0.1
      }
    }'::jsonb
  );

-- Insérer des rapports générés avec différents statuts
INSERT INTO generated_reports (template_id, name, status, data, created_at, completed_at)
SELECT 
  t.id,
  'Rapport mensuel - Mars 2024',
  'completed',
  '{
    "summary": {
      "total_users": 156,
      "total_sessions": 892,
      "average_duration": "45 minutes",
      "top_apps": [
        {"name": "Beat Saber", "usage_hours": 234},
        {"name": "Half-Life: Alyx", "usage_hours": 189},
        {"name": "Population: One", "usage_hours": 145}
      ]
    },
    "charts": {
      "daily_usage": "https://example.com/chart1.png",
      "app_distribution": "https://example.com/chart2.png"
    }
  }'::jsonb,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days 18 hours'
FROM report_templates t
WHERE t.name = 'Rapport mensuel d''utilisation'
UNION ALL
SELECT 
  t.id,
  'Audit de sécurité Q1 2024',
  'processing',
  NULL,
  NOW() - INTERVAL '2 hours',
  NULL
FROM report_templates t
WHERE t.name = 'Audit de sécurité'
UNION ALL
SELECT 
  t.id,
  'Analyse réseau - Semaine 12',
  'completed',
  '{
    "summary": {
      "devices_analyzed": 42,
      "average_latency": "23ms",
      "bandwidth_usage": "1.2TB",
      "issues_detected": 3
    },
    "recommendations": [
      "Optimiser la configuration WiFi pour les salles 3 et 4",
      "Mettre à jour les firmwares des routeurs",
      "Réduire la distance entre les appareils et les points d''accès"
    ]
  }'::jsonb,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '22 hours'
FROM report_templates t
WHERE t.name = 'Analyse des performances réseau'
UNION ALL
SELECT 
  t.id,
  'Rapport mensuel - Février 2024',
  'completed',
  '{
    "summary": {
      "total_users": 143,
      "total_sessions": 756,
      "average_duration": "42 minutes",
      "top_apps": [
        {"name": "Beat Saber", "usage_hours": 198},
        {"name": "Population: One", "usage_hours": 167},
        {"name": "Superhot VR", "usage_hours": 134}
      ]
    }
  }'::jsonb,
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '34 days 16 hours'
FROM report_templates t
WHERE t.name = 'Rapport mensuel d''utilisation';