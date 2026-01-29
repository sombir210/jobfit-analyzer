-- Create table for job roles with required skills
CREATE TABLE public.job_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('technical', 'telecom', 'other')),
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on job_roles (publicly readable)
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;

-- Anyone can read job roles
CREATE POLICY "Job roles are publicly readable"
ON public.job_roles
FOR SELECT
USING (true);

-- Create table for resume analyses
CREATE TABLE public.resume_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  extracted_skills TEXT[] NOT NULL DEFAULT '{}',
  education TEXT[],
  experience_years INTEGER,
  match_score INTEGER NOT NULL DEFAULT 0,
  suitability TEXT NOT NULL CHECK (suitability IN ('suitable', 'partially_suitable', 'not_suitable')),
  missing_skills TEXT[] DEFAULT '{}',
  recommended_roles JSONB DEFAULT '[]',
  raw_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resume_analyses
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Anyone can insert and read their own analyses (by session)
CREATE POLICY "Anyone can create resume analyses"
ON public.resume_analyses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read resume analyses"
ON public.resume_analyses
FOR SELECT
USING (true);

-- Insert predefined job roles for each domain
INSERT INTO public.job_roles (title, domain, required_skills, preferred_skills, description) VALUES
-- Technical roles
('Software Developer', 'technical', 
  ARRAY['programming', 'java', 'python', 'javascript', 'software development', 'algorithms', 'data structures', 'git', 'debugging'],
  ARRAY['react', 'node.js', 'typescript', 'sql', 'aws', 'docker', 'agile', 'ci/cd'],
  'Develops and maintains software applications using various programming languages and frameworks.'),
('Web Developer', 'technical',
  ARRAY['html', 'css', 'javascript', 'web development', 'responsive design', 'frontend'],
  ARRAY['react', 'vue', 'angular', 'node.js', 'typescript', 'rest api', 'git', 'sass'],
  'Creates and maintains websites and web applications with modern technologies.'),
('Data Analyst', 'technical',
  ARRAY['data analysis', 'sql', 'excel', 'python', 'statistics', 'data visualization'],
  ARRAY['tableau', 'power bi', 'r', 'machine learning', 'pandas', 'numpy', 'etl'],
  'Analyzes data to provide insights and support business decision-making.'),
('Full Stack Developer', 'technical',
  ARRAY['javascript', 'react', 'node.js', 'database', 'api development', 'html', 'css'],
  ARRAY['typescript', 'mongodb', 'postgresql', 'docker', 'aws', 'graphql'],
  'Develops both frontend and backend components of web applications.'),
('DevOps Engineer', 'technical',
  ARRAY['linux', 'docker', 'kubernetes', 'ci/cd', 'aws', 'scripting', 'automation'],
  ARRAY['terraform', 'ansible', 'jenkins', 'monitoring', 'security', 'python'],
  'Manages infrastructure, deployment pipelines, and system reliability.'),

-- Telecom roles
('Telecom Engineer', 'telecom',
  ARRAY['telecommunications', 'networking', 'rf engineering', 'wireless', '4g', '5g', 'signal processing'],
  ARRAY['voip', 'iot', 'protocol analysis', 'antenna design', 'microwave', 'fiber optics'],
  'Designs, implements, and maintains telecommunication systems and networks.'),
('Network Engineer', 'telecom',
  ARRAY['networking', 'cisco', 'routing', 'switching', 'tcp/ip', 'firewall', 'vpn'],
  ARRAY['ccna', 'ccnp', 'juniper', 'network security', 'load balancing', 'sdwan'],
  'Designs and maintains computer networks ensuring optimal performance and security.'),
('Network Support Engineer', 'telecom',
  ARRAY['technical support', 'troubleshooting', 'networking', 'customer service', 'windows', 'linux'],
  ARRAY['ticketing systems', 'remote support', 'documentation', 'voip', 'network monitoring'],
  'Provides technical support for network-related issues and maintains network infrastructure.'),
('RF Engineer', 'telecom',
  ARRAY['rf engineering', 'antenna', 'wireless', 'signal processing', 'electromagnetic'],
  ARRAY['matlab', 'simulation', '5g', 'lte', 'spectrum analysis'],
  'Designs and optimizes radio frequency systems for wireless communication.'),

-- Other/Non-Tech roles
('Operations Executive', 'other',
  ARRAY['operations', 'management', 'communication', 'coordination', 'planning', 'excel'],
  ARRAY['erp', 'logistics', 'vendor management', 'budgeting', 'reporting'],
  'Manages day-to-day operations and ensures smooth business processes.'),
('Technical Support', 'other',
  ARRAY['customer service', 'troubleshooting', 'communication', 'problem solving', 'documentation'],
  ARRAY['ticketing', 'remote support', 'hardware', 'software', 'crm'],
  'Provides technical assistance and support to customers and end-users.'),
('Management Trainee', 'other',
  ARRAY['communication', 'leadership', 'teamwork', 'problem solving', 'adaptability'],
  ARRAY['project management', 'presentation', 'analytics', 'negotiation'],
  'Entry-level management position with training across various business functions.'),
('Business Analyst', 'other',
  ARRAY['business analysis', 'requirements gathering', 'documentation', 'communication', 'excel'],
  ARRAY['sql', 'agile', 'jira', 'data analysis', 'stakeholder management'],
  'Bridges business needs and technical solutions through analysis and documentation.'),
('HR Executive', 'other',
  ARRAY['human resources', 'recruitment', 'communication', 'employee relations', 'hr policies'],
  ARRAY['hris', 'payroll', 'training', 'performance management', 'labor law'],
  'Manages human resources functions including recruitment and employee relations.');