package com.whatsapp.wp_messages_queue.config;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;

@Configuration
public class RedisConfig {

    @Bean
    public JedisPool jedisPool() {
        GenericObjectPoolConfig<redis.clients.jedis.Jedis> poolConfig = new GenericObjectPoolConfig<>();
        poolConfig.setJmxEnabled(false); // Desactiva el registro de MBeans
        return new JedisPool(poolConfig, "localhost", 6379, 2000);
    }
}
