-- ============================================================
-- KYSS Vision — Migration 005: Seed Data + Row Level Security
-- US-009
-- Apply AFTER 004_remaining_schema.sql
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- SEED: Work Type Categories
-- ──────────────────────────────────────────────────────────

INSERT INTO work_type_categories (name, slug, icon, description, display_order) VALUES
  ('Fruit Picking',       'fruit-picking',   '🍎', 'Kiwifruit, apples, berries, stonefruit, citrus',                 1),
  ('Packing & Processing','packing',         '📦', 'Packhouse work — sorting, grading, boxing produce',              2),
  ('Pruning',             'pruning',         '✂️', 'Vine and tree pruning, seasonal maintenance',                    3),
  ('Thinning',            'thinning',        '🌿', 'Fruit thinning, canopy management',                              4),
  ('Vineyard',            'vineyard',        '🍇', 'Harvest, cellar door, wine production',                          5),
  ('Dairy & Farming',     'dairy-farming',   '🐄', 'Milking, fencing, general farm operations',                      6),
  ('Hospitality',         'hospitality',     '🏨', 'Hotels, restaurants, tourism seasonal roles',                    7),
  ('Construction',        'construction',    '🔨', 'Seasonal building and renovation projects',                      8),
  ('Horticulture',        'horticulture',    '🌱', 'Nurseries, landscaping, garden centers',                         9)
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- HELPER FUNCTION: get current user's role from user_profiles
-- Used in RLS policies to avoid repeated subqueries
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM user_profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ──────────────────────────────────────────────────────────
-- ENABLE RLS ON ALL TABLES
-- ──────────────────────────────────────────────────────────

ALTER TABLE user_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_type_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_pools             ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_memberships       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_post_comments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports                ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects              ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: user_profiles
-- ──────────────────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "user_profiles_select_own" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "user_profiles_update_own" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "user_profiles_select_admin" ON user_profiles
  FOR SELECT USING (get_my_role() = 'admin');

-- Admins can update all profiles
CREATE POLICY "user_profiles_update_admin" ON user_profiles
  FOR UPDATE USING (get_my_role() = 'admin');

-- Allow insert during sign-up (authenticated user inserts their own row)
CREATE POLICY "user_profiles_insert_own" ON user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: worker_profiles
-- ──────────────────────────────────────────────────────────

CREATE POLICY "worker_profiles_select_own" ON worker_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "worker_profiles_update_own" ON worker_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "worker_profiles_insert_own" ON worker_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Employers can read worker profiles for workers in their pools
CREATE POLICY "worker_profiles_select_employer" ON worker_profiles
  FOR SELECT USING (
    get_my_role() = 'employer' AND
    EXISTS (
      SELECT 1 FROM pool_memberships pm
      JOIN work_pools wp ON wp.id = pm.pool_id
      JOIN employer_profiles ep ON ep.id = wp.employer_id
      WHERE pm.worker_id = worker_profiles.user_id
        AND ep.user_id = auth.uid()
        AND pm.status = 'active'
    )
  );

-- Admins can read/write all worker profiles
CREATE POLICY "worker_profiles_admin" ON worker_profiles
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: employer_profiles
-- ──────────────────────────────────────────────────────────

CREATE POLICY "employer_profiles_select_own" ON employer_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "employer_profiles_update_own" ON employer_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "employer_profiles_insert_own" ON employer_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Workers can read employer profiles (for pool pages)
CREATE POLICY "employer_profiles_select_worker" ON employer_profiles
  FOR SELECT USING (get_my_role() = 'worker');

-- Admins can read/write all employer profiles
CREATE POLICY "employer_profiles_admin" ON employer_profiles
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: work_type_categories
-- ──────────────────────────────────────────────────────────

-- Public read (needed for landing page, no auth required)
CREATE POLICY "work_type_categories_public_read" ON work_type_categories
  FOR SELECT USING (active = true);

-- Admins can manage categories
CREATE POLICY "work_type_categories_admin" ON work_type_categories
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: work_pools
-- ──────────────────────────────────────────────────────────

-- Workers and public can read non-archived pools
CREATE POLICY "work_pools_public_read" ON work_pools
  FOR SELECT USING (status != 'archived');

-- Employers can read their own pools (including archived)
CREATE POLICY "work_pools_select_employer" ON work_pools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employer_profiles ep
      WHERE ep.id = work_pools.employer_id AND ep.user_id = auth.uid()
    )
  );

-- Admins can read/write all pools
CREATE POLICY "work_pools_admin" ON work_pools
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: pool_memberships
-- ──────────────────────────────────────────────────────────

-- Workers can read their own memberships
CREATE POLICY "pool_memberships_select_own" ON pool_memberships
  FOR SELECT USING (worker_id = auth.uid());

-- Workers can join pools (insert their own membership)
CREATE POLICY "pool_memberships_insert_own" ON pool_memberships
  FOR INSERT WITH CHECK (
    worker_id = auth.uid() AND
    get_my_role() = 'worker'
  );

-- Workers can update their own membership (e.g., leave a pool)
CREATE POLICY "pool_memberships_update_own" ON pool_memberships
  FOR UPDATE USING (worker_id = auth.uid());

-- Employers can read memberships for their pools
CREATE POLICY "pool_memberships_select_employer" ON pool_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM work_pools wp
      JOIN employer_profiles ep ON ep.id = wp.employer_id
      WHERE wp.id = pool_memberships.pool_id AND ep.user_id = auth.uid()
    )
  );

-- Admins can read/write all memberships
CREATE POLICY "pool_memberships_admin" ON pool_memberships
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: pool_posts
-- ──────────────────────────────────────────────────────────

-- Workers can read posts for pools they are members of
CREATE POLICY "pool_posts_select_member" ON pool_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pool_memberships pm
      WHERE pm.pool_id = pool_posts.pool_id
        AND pm.worker_id = auth.uid()
        AND pm.status = 'active'
    )
  );

-- Employers can read and create posts for their own pools
CREATE POLICY "pool_posts_employer" ON pool_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM work_pools wp
      JOIN employer_profiles ep ON ep.id = wp.employer_id
      WHERE wp.id = pool_posts.pool_id AND ep.user_id = auth.uid()
    )
  );

-- Admins can read/write all posts
CREATE POLICY "pool_posts_admin" ON pool_posts
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: pool_post_comments
-- ──────────────────────────────────────────────────────────

-- Members of the pool can read and create comments
CREATE POLICY "pool_post_comments_member" ON pool_post_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pool_posts pp
      JOIN pool_memberships pm ON pm.pool_id = pp.pool_id
      WHERE pp.id = pool_post_comments.post_id
        AND pm.worker_id = auth.uid()
        AND pm.status = 'active'
    )
  );

-- Employers can read/write comments on their pool posts
CREATE POLICY "pool_post_comments_employer" ON pool_post_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pool_posts pp
      JOIN work_pools wp ON wp.id = pp.pool_id
      JOIN employer_profiles ep ON ep.id = wp.employer_id
      WHERE pp.id = pool_post_comments.post_id AND ep.user_id = auth.uid()
    )
  );

-- Admins can read/write all comments
CREATE POLICY "pool_post_comments_admin" ON pool_post_comments
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: conversations + messages
-- ──────────────────────────────────────────────────────────

-- Users can read conversations they participate in
CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "conversations_insert_participant" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));

-- Admins can read all conversations
CREATE POLICY "conversations_admin" ON conversations
  FOR ALL USING (get_my_role() = 'admin');

-- Users can read messages in their conversations
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id AND auth.uid() = ANY(c.participant_ids)
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id AND auth.uid() = ANY(c.participant_ids)
    )
  );

-- Users can mark messages as read
CREATE POLICY "messages_update_read" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id AND auth.uid() = ANY(c.participant_ids)
    )
  );

-- Admins can read all messages
CREATE POLICY "messages_admin" ON messages
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: notifications
-- ──────────────────────────────────────────────────────────

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can create notifications for any user
CREATE POLICY "notifications_admin" ON notifications
  FOR ALL USING (get_my_role() = 'admin');

-- System can insert notifications (service role bypasses RLS)

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: reviews
-- ──────────────────────────────────────────────────────────

-- Anyone authenticated can read reviews
CREATE POLICY "reviews_select_authenticated" ON reviews
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can create reviews (one per pool)
CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Admins can manage all reviews
CREATE POLICY "reviews_admin" ON reviews
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: reports
-- ──────────────────────────────────────────────────────────

-- Users can create reports
CREATE POLICY "reports_insert_own" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Users can read their own reports
CREATE POLICY "reports_select_own" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

-- Admins can read/write all reports
CREATE POLICY "reports_admin" ON reports
  FOR ALL USING (get_my_role() = 'admin');

-- ──────────────────────────────────────────────────────────
-- RLS POLICIES: admin_actions + prospects
-- ──────────────────────────────────────────────────────────

-- Only admins can access admin_actions
CREATE POLICY "admin_actions_admin_only" ON admin_actions
  FOR ALL USING (get_my_role() = 'admin');

-- Only admins can access prospects
CREATE POLICY "prospects_admin_only" ON prospects
  FOR ALL USING (get_my_role() = 'admin');
