
-- create flyway schema table
CREATE TABLE flyway_schema_history (
    installed_rank integer PRIMARY KEY,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone NOT NULL DEFAULT now(),
    execution_time integer NOT NULL,
    success boolean NOT NULL
);

-- create indices for flyway schema table
CREATE UNIQUE INDEX flyway_schema_history_pk ON flyway_schema_history(installed_rank int4_ops);
CREATE INDEX flyway_schema_history_s_idx ON flyway_schema_history(success bool_ops);

CREATE TABLE games
(
    id SERIAL PRIMARY KEY,
    session_id character varying(250) NOT NULL
);

INSERT INTO games(session_id) VALUES ('123');